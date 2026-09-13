import { createUuidIdGenerator } from "@/src/modules/shared/infra/id/uuid/uuid.id-generator"
import { createId } from "./id"

const createIdFactory = () => {
  const provider = createUuidIdGenerator()

  return createId(provider)
}

export { createIdFactory }
