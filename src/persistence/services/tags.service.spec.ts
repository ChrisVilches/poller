import { createTestingModule } from '@test/helpers/createTestingModule';
import { INestApplication } from '@nestjs/common';
import { TagsService } from './tags.service';
import { ValidationError } from 'class-validator';
import { Tag } from '@persistence/entities/tag.entity';
import '@test/matchers/toThrowErrorType';
import { EntityNotFoundError } from 'typeorm';

describe(TagsService.name, () => {
  let app: INestApplication;
  let service: TagsService;

  beforeEach(async () => {
    app = await createTestingModule();
    service = app.get<TagsService>(TagsService);
  });

  afterEach(async () => {
    await app.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('validates name format', async () => {
      await expect(
        async () => await service.create({ name: '' }),
      ).toThrowErrorType(ValidationError);
      await expect(
        async () => await service.create({ name: '   ' }),
      ).toThrowErrorType(ValidationError);
    });

    it('converts name', async () => {
      const created: Tag = await service.create({ name: '   a  ' });
      expect(created.name).toBe('a');
    });

    it('validates name unique', async () => {
      await service.create({ name: '   b  ' });
      await expect(
        async () => await service.create({ name: '   b ' }),
      ).toThrowErrorType(ValidationError);
    });
  });

  describe('update', () => {
    let id: number;
    let id2: number;

    beforeEach(async () => {
      id = (await service.create({ name: 'some tag' })).id;
      id2 = (await service.create({ name: 'other tag' })).id;
    });

    it('validates name format', async () => {
      await expect(
        async () => await service.update(id, { name: '' }),
      ).toThrowErrorType(ValidationError);
      await expect(
        async () => await service.update(id, { name: '   ' }),
      ).toThrowErrorType(ValidationError);
    });

    it('converts name', async () => {
      const updated: Tag = await service.update(id, { name: '   a  ' });
      expect(updated.name).toBe('a');
    });

    it('errors when ID does not exist', async () => {
      await expect(async () => {
        await service.update(232323, { name: '   a  ' });
      }).toThrowErrorType(EntityNotFoundError);
    });

    it('allows empty object', async () => {
      const updated: Tag = await service.update(id, {});
      expect(updated.name).toBe('some tag');
    });

    it('validates name unique', async () => {
      await service.update(id, { name: '   b  ' });
      await expect(
        async () => await service.update(id2, { name: '   b ' }),
      ).toThrowErrorType(ValidationError);
    });

    it('allows patching the same name', async () => {
      await service.update(id, { name: '   b  ' });
      await service.update(id, { name: '   b  ' });
    });
  });

  describe('findByName', () => {
    let favoriteTag: Tag;

    beforeEach(async () => {
      await service.create({ name: 'some tag' });
      await service.create({ name: 'another tag' });
      await service.create({ name: 'the name' });
      favoriteTag = await service.create({ name: 'favorites' });
    });

    it('returns nothing if name is empty (with trailing and leading spaces)', async () => {
      expect(await service.findByName('')).toBeNull();
      expect(await service.findByName('   ')).toBeNull();
    });

    it('finds correctly (with trailing and leading spaces)', async () => {
      expect(await service.findByName(' favorites ')).toBeInstanceOf(Tag);
      expect(await service.findByName('favorites')).toBeInstanceOf(Tag);
    });

    it('finds correctly (case insensitive)', async () => {
      expect((await service.findByName(' fAvorItes '))?.id).toBe(
        favoriteTag.id,
      );
      expect((await service.findByName('favoriTeS'))?.id).toBe(favoriteTag.id);
    });

    it('finds nothing if it does not exist', async () => {
      expect(await service.findByName(' favoritesx ')).toBeNull();
      expect(await service.findByName('favoritefs')).toBeNull();
    });
  });
});
