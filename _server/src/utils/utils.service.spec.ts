import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { UtilsService } from './utils.service';

describe('UtilsService', () => {
  let utilsService: UtilsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [UtilsService],
    }).compile();

    utilsService = module.get<UtilsService>(UtilsService);
  });

  describe('[텍스트 암호화] UtilsService.encrypt()', () => {
    it('암호화 문구 반환', async () => {
      // given
      const plainText = 'test';

      // when
      const result = await utilsService.encrypt(plainText);

      // then
      expect(typeof result).toEqual('string');
    });
  });

  describe('[암호화된 문자 비교] UtilsService.compare()', () => {
    it('평문과 암호화된 문자열이 일치하지 않는경우, false', async () => {
      // given
      const plainText = 'test';
      const hashedText = 'hashedTest';

      // when
      jest.spyOn(utilsService, 'encrypt').mockResolvedValue('hashedTest1');
      const result = await utilsService.compare(plainText, hashedText);

      // then
      expect(result).toEqual(false);
    });

    it('평문과 암호화된 문자열이 일치하는 경우, true', async () => {
      // given
      const plainText = 'test';
      const hashedText = 'hashedTest';

      // when
      jest.spyOn(utilsService, 'encrypt').mockResolvedValue('hashedTest');
      jest.spyOn(utilsService, 'compare').mockResolvedValue(true);
      const result = await utilsService.compare(plainText, hashedText);

      // then
      expect(result).toEqual(true);
    });
  });

  describe('[UUID 생성] UtilsService.getUUID()', () => {
    it('정상적인 UUID 생성시 36자리의 문자열 반환', () => {
      // given

      // when
      const result = utilsService.getUUID();

      // then
      expect(typeof result).toEqual('string');
      expect(result.length).toEqual(36);
    });
  });
});
