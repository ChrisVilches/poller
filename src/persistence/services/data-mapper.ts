import { EndpointCreateDto } from '@api/dto/endpoint-create.dto';
import { EndpointUpdateDto } from '@api/dto/endpoint-update.dto';
import { TagUpsertDto } from '@api/dto/tag-upsert.dto';
import { Endpoint } from '@persistence/entities/endpoint.entity';
import { Tag } from '@persistence/entities/tag.entity';
import {
  convertArgs,
  convertMethod,
  convertNav,
  convertType,
} from '@util/endpoints';
import { ClassType, transformAndValidate } from 'class-transformer-validator';

// Returns an instance of `Endpoint`, but all fields can be undefined.
// It builds a plain object using the DTO object as a starting point. Transform
// every property to its required format (by Endpoint entity class definition), and finally
// builds a (possibly partial) Endpoint entity object from the plain object.
export const endpointDtoToEntity = async <T extends object>(
  classType: ClassType<T>,
  dto: EndpointCreateDto | EndpointUpdateDto,
): Promise<Endpoint> => {
  dto = await transformAndValidate(classType, dto);

  const result: Record<string, any> = dto;

  if (dto.type) {
    result.type = convertType(dto.type);
  }
  if (dto.method) {
    result.method = convertMethod(dto.method);
  }
  if (dto.navigations) {
    result.navigations = convertNav(dto.navigations);
  }
  if (dto.arguments) {
    result.arguments = convertArgs(dto.arguments);
  }

  if ((dto as EndpointUpdateDto).tags) {
    const tags = (dto as EndpointUpdateDto).tags?.map((id: number) => {
      const t = new Tag();
      t.id = id;
      return t;
    });

    result.tags = tags ?? [];
  }

  return Endpoint.from(result);
};

export const tagDtoToEntity = async (dto: TagUpsertDto): Promise<Tag> => {
  dto = await transformAndValidate(TagUpsertDto, dto);
  const result = new Tag();
  result.name = dto.name;
  return result;
};
