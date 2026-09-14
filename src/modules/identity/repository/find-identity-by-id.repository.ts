import type { Result } from "@/src/modules/shared/result"
import type { Identity, IdentityId } from "../identity.entity"
import type { IdentityRepositoryError } from "./identity-repository-error"

type FindIdentityByIdRepository = {
  findById(id: IdentityId): Promise<Result<Identity | null, IdentityRepositoryError>>
}

export type { FindIdentityByIdRepository }
