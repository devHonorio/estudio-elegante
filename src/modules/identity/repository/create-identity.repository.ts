import type { Result } from "@/src/modules/shared/result"
import type { Identity } from "../identity.entity"
import type { IdentityRepositoryError } from "./identity-repository-error"

type CreateIdentityRepositoryInput = Identity

type CreateIdentityRepository = {
  create(
    input: CreateIdentityRepositoryInput,
  ): Promise<Result<Identity, IdentityRepositoryError>>
}

export type { CreateIdentityRepositoryInput, CreateIdentityRepository }
