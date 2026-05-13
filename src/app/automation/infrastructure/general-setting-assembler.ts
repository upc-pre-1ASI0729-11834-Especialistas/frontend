import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { GeneralSetting } from '../domain/model/general-setting.entity';
import { GeneralSettingResource, GeneralSettingsResponse } from './general-setting-response';

export class GeneralSettingAssembler implements BaseAssembler<GeneralSetting, GeneralSettingResource, GeneralSettingsResponse> {
  toEntitiesFromResponse(response: GeneralSettingsResponse): GeneralSetting[] {
    return response.generalSettings.map(resource => this.toEntityFromResource(resource as GeneralSettingResource));
  }

  toEntityFromResource(resource: GeneralSettingResource): GeneralSetting {
    return new GeneralSetting({
      id: resource.id,
      key: resource.key,
      value: resource.value,
      category: resource.category,
      description: resource.description,
    });
  }

  toResourceFromEntity(entity: GeneralSetting): GeneralSettingResource {
    return {
      id: entity.id,
      key: entity.key,
      value: entity.value,
      category: entity.category,
      description: entity.description,
    } as GeneralSettingResource;
  }
}
