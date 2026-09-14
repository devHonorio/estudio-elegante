import type { Result } from "@/src/modules/shared/result"
import type { Phone } from "@/src/modules/shared/value-object/phone"
import type { Identity } from "../identity.entity"
import type { IdentityRepositoryError } from "./identity-repository-error"

type FindIdentityByPhoneRepository = {
  findByPhone(phone: Phone): Promise<Result<Identity | null, IdentityRepositoryError>>
}

export type { FindIdentityByPhoneRepository }
