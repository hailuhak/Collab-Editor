import type { PermissionRole } from "@prisma/client";

export const ROLE_WEIGHT: Record<PermissionRole, number> = {
  VIEWER: 0,
  COMMENTER: 1,
  EDITOR: 2,
  OWNER: 3,
};

export function canView(role: PermissionRole): boolean {
  return ROLE_WEIGHT[role] >= ROLE_WEIGHT.VIEWER;
}

export function canComment(role: PermissionRole): boolean {
  return ROLE_WEIGHT[role] >= ROLE_WEIGHT.COMMENTER;
}

export function canEdit(role: PermissionRole): boolean {
  return ROLE_WEIGHT[role] >= ROLE_WEIGHT.EDITOR;
}

export function canManage(role: PermissionRole): boolean {
  return role === "OWNER";
}

export function roleLabel(role: PermissionRole): string {
  switch (role) {
    case "OWNER":
      return "Owner";
    case "EDITOR":
      return "Editor";
    case "COMMENTER":
      return "Commenter";
    default:
      return "Viewer";
  }
}
