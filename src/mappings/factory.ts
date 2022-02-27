import {
  PoolCreation
} from "../../generated/PoolFactory/PoolFactory"
import { Factory, Pool } from "../../generated/schema"
import { MetaversepadTemplate } from "../../generated/templates"
import { BigInt } from "@graphprotocol/graph-ts";

export function handlePoolCreation(event: PoolCreation): void {
  let factoryEntity = Factory.load(event.address.toHex())
  let poolEntity = Pool.load(event.params.poolAddress.toHex())

  if (!factoryEntity) {
    factoryEntity = new Factory(event.address.toHex())
  }

  if (!poolEntity) {
    poolEntity = new Pool(event.params.poolAddress.toHex())
  }

  if(event.params.noOfTiers == BigInt.fromI32(5)){
    factoryEntity.totalProject = factoryEntity.totalProject.plus(BigInt.fromI32(1))
  }
  
  poolEntity.factory = event.address.toHex()
  poolEntity.maxCap = event.params.poolMaxCap
  poolEntity.createdAt = event.params.timestamp
  poolEntity.startedAt = event.params.saleStartTime
  poolEntity.endedAt = event.params.saleEndTime
  poolEntity.tiers = event.params.noOfTiers
  poolEntity.participants = event.params.totalParticipants
  poolEntity.totalRaised = BigInt.fromI32(0)
  
  MetaversepadTemplate.create(event.params.poolAddress)
  
  factoryEntity.save()
  poolEntity.save()
}