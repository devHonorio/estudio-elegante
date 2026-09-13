import { v7 as uuidv7 } from "uuid"
import type { IdGeneratorProvider } from "@/src/modules/shared/value-object/id/id-generator.provider"

const createUuidIdGenerator = (): IdGeneratorProvider => {
  return {
    generate: () => uuidv7(),
  }
}

export { createUuidIdGenerator }
