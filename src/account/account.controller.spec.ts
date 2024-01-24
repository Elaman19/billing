import { Test } from '@nestjs/testing';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';

describe('AccountController', () => {
  let billingController: AccountController;
  let billingService: AccountService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
        controllers: [AccountController],
        providers: [AccountService],
      }).compile();

    billingService = moduleRef.get<AccountService>(AccountService);
    billingController = moduleRef.get<AccountController>(AccountController);
  });

  describe('findAll', () => {
    it('should return an array of cats', async () => {
      const result = ['test'];
      //jest.spyOn(billingService, 'createAccount').mockImplementation(() => result);

      expect(await billingController.createAccount({userId: 'sd'})).toBe(result);
    });
  });
});