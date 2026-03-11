import { IsString, IsEnum } from 'class-validator';

export enum ResourceTypeEnum {
  workout = 'workout',
  template = 'template',
}

export enum PermissionEnum {
  view = 'view',
  edit = 'edit',
}

export class ShareDto {
  @IsString()
  resourceType: 'workout' | 'template';

  @IsString()
  resourceId: string;

  @IsString()
  sharedWithId: string;

  @IsEnum(PermissionEnum)
  permission: 'view' | 'edit';
}
