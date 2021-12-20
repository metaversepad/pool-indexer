import {
  PoolCreation
} from "../../generated/PoolFactory/PoolFactory"
import { Factory } from "../../generated/schema"
import { MetaversepadTemplate } from "../../generated/templates"

export function handlePoolCreation(event: PoolCreation): void {
  let factoryEntity = Factory.load(event.transaction.hash.toHex())

  if (!factoryEntity) {
    factoryEntity = new Factory(event.transaction.hash.toHex())
  }

  factoryEntity.timestamp = event.params.timestamp
  factoryEntity.poolAddress = event.params.poolAddress

  MetaversepadTemplate.create(event.params.poolAddress)

  factoryEntity.save()
}