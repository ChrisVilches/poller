import { EndpointCreateDto } from '@api/dto/endpoint-create.dto';
import { EndpointUpdateDto } from '@api/dto/endpoint-update.dto';
import { Argument } from '@persistence/entities/argument.entity';
import { Endpoint } from '@persistence/entities/endpoint.entity';
import { Navigation } from '@persistence/entities/navigation.entity';
import { Tag } from '@persistence/entities/tag.entity';
import { Method } from '@persistence/enum/method.enum';
import { RequestType } from '@persistence/enum/request-type.enum';
import { ClassType, transformAndValidate } from 'class-transformer-validator';

const convertMethod = (method: string): Method => {
  const map = {
    GET: Method.GET,
    POST: Method.POST,
    PUT: Method.PUT,
    PATCH: Method.PATCH,
    DELETE: Method.DELETE,
  };

  return map[method.toUpperCase() as keyof typeof map];
};

const convertType = (type: string): RequestType => {
  const map = {
    HTML: RequestType.HTML,
    DHTML: RequestType.DHTML,
    JSON: RequestType.JSON,
  };

  return map[type.toUpperCase() as keyof typeof map];
};

export const convertNav = (nav: string[]): Navigation[] =>
  nav.map((selector: string) => {
    const nav = new Navigation();
    nav.selector = selector;
    return nav;
  });

export const convertArgs = (args: any[]): Argument[] =>
  args.map(Argument.fromValue);

/**
 * Returns an instance of `Endpoint`, but all fields can be undefined.
 * // TODO: How can we rename this function so that its intention is more clear?
 *          It's meant to be used as the final step before executing a CRUD
 *          operation like create or update (which require an object which structure
 *          is not very clear, which is why this function is also not very clear as well).
 *
 *          Consider using PartialType (all fields can be undefined).
 */
export const endpointDtoToEntity = async <T extends object>(
  classType: ClassType<T>,
  dto: EndpointCreateDto | EndpointUpdateDto,
): Promise<Endpoint> => {
  dto = await transformAndValidate(classType, dto);

  const { arguments: _, navigations: __, ...other } = dto;

  const result = { ...new Endpoint(), ...other } as any;

  if (dto.type) {
    result.type = convertType(dto.type);
  }
  if (dto.method) {
    result.method = convertMethod(dto.method);
  }
  if (dto.navigations) {
    result.navigationList = convertNav(dto.navigations);
  }
  if (dto.arguments) {
    result.argumentList = convertArgs(dto.arguments);
  }

  if ((dto as EndpointUpdateDto).tags) {
    const tags = (dto as EndpointUpdateDto).tags?.map((id: number) => {
      const t = new Tag();
      t.id = id;
      return t;
    });

    result.tags = tags ?? [];
  }

  return result;
};
