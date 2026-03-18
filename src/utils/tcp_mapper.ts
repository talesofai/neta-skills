import type { TravelCharacterParentProfileDto } from "../apis/tcp.ts";
import type { CharacterAssign, ElementumAssign } from "../apis/types.ts";

/**
 * Map backend TCP profile DTO to agent-facing CharacterAssign.
 * Transforms backend type ("oc" | "official") to agent type ("character").
 */
export function mapProfileToCharacterAssign(
  profile: TravelCharacterParentProfileDto,
): CharacterAssign {
  return {
    type: "character",
    uuid: profile.uuid,
    name: profile.name,
    age: profile.oc_bio?.age ?? null,
    interests: profile.oc_bio?.interests ?? null,
    persona: profile.oc_bio?.persona ?? null,
    description: profile.oc_bio?.description ?? null,
    occupation: profile.oc_bio?.occupation ?? null,
    avatar_img: profile.config?.avatar_img ?? null,
    header_img: profile.config?.header_img ?? null,
  };
}

/**
 * Map backend TCP profile DTO to agent-facing ElementumAssign.
 * Backend type is already "elementum".
 */
export function mapProfileToElementumAssign(
  profile: TravelCharacterParentProfileDto,
): ElementumAssign {
  return {
    type: "elementum",
    uuid: profile.uuid,
    name: profile.name,
    description: profile.oc_bio?.description ?? null,
    avatar_img: profile.config?.avatar_img ?? null,
  };
}

/**
 * Map backend TCP profile DTO to appropriate agent-facing assign type.
 * Automatically detects character vs elementum from profile.type.
 */
export function mapProfileToAssign(
  profile: TravelCharacterParentProfileDto,
): CharacterAssign | ElementumAssign {
  if (profile.type === "elementum") {
    return mapProfileToElementumAssign(profile);
  }
  return mapProfileToCharacterAssign(profile);
}
