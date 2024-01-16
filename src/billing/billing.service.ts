import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transaction } from 'src/transaction/model/transaction.model';
import { Account } from 'src/user/models/account.model';
import { User } from 'src/user/models/user.model';

@Injectable()
export class BillingService {
  
}
