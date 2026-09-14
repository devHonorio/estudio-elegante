import { createUuidIdGenerator } from "@/src/modules/shared/infra/id/uuid/uuid.id-generator"
import { createIdentityId } from "./identity-id.value-object"

const createIdentityIdFactory = () => {
  const provider = createUuidIdGenerator()

  return createIdentityId(provider)
}

const IdentityId = createIdentityIdFactory()

export { createIdentityIdFactory, IdentityId }
