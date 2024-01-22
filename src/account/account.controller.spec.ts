import { Test } from '@nestjs/testing';
import { BillingController } from './billing.controller';
import { BillingService } from './account.service';

describe('BillingController', () => {
  let billingController: BillingController;
  let billingService: BillingService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
        controllers: [BillingController],
        providers: [BillingService],
      }).compile();

    billingService = moduleRef.get<BillingService>(BillingService);
    billingController = moduleRef.get<BillingController>(BillingController);
  });

  describe('findAll', () => {
    it('should return an array of cats', async () => {
      const result = ['test'];
      //jest.spyOn(billingService, 'createAccount').mockImplementation(() => result);

      expect(await billingController.createAccount({userId: 'sd'})).toBe(result);
    });
  });
});