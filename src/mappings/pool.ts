import {
  FundPool
} from "../../generated/templates/MetaversepadTemplate/Metaversepad"
import { Factory, Pool, UserInPool } from "../../generated/schema"
import { Address, BigInt } from "@graphprotocol/graph-ts";

export function addRaisedFundByPool(address: Address, newValue: BigInt): void {
  let id = address.toHex()
  let pool = Pool.load(id)
  if (pool == null) {
    pool = new Pool(id)
  }
  pool.totalRaised = pool.totalRaised.plus(newValue)
  pool.save()
}

export function addRaisedFundToFactory(newValue: BigInt): void {
  let id = "0xe46fefa26b08c7c98eb94d842b1b0b37f4c1029a"
  let factory = Factory.load(id)
  if (factory == null) {
    factory = new Factory(id)
  }
  factory.totalRaised = factory.totalRaised.plus(newValue)
  factory.save()
}

export function handleFundPool(evtPoolInfo: FundPool): void {
  let userInPoolEntity = UserInPool.load(evtPoolInfo.params.initiator.toHex() + "-" + evtPoolInfo.address.toHex())

  if (!userInPoolEntity) {
    userInPoolEntity = new UserInPool(evtPoolInfo.params.initiator.toHex() + "-" + evtPoolInfo.address.toHex())
  }

  userInPoolEntity.pool = evtPoolInfo.address
  userInPoolEntity.user = evtPoolInfo.params.initiator
  userInPoolEntity.value = userInPoolEntity.value.plus(evtPoolInfo.params.value)

  addRaisedFundByPool(evtPoolInfo.address, evtPoolInfo.params.value)
  addRaisedFundToFactory(evtPoolInfo.params.value)
  
  userInPoolEntity.save() 
}
