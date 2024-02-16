import { BadRequestException, ConflictException, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { User, UserDocument } from './model/user.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { TimeInterval } from 'src/constants';
import { BookSlotDto } from './dto/book-slot.dto';
import { pbkdf2Sync } from 'node:crypto'
import { Schedule, ScheduleDocument } from './model/schedule.model';

@Injectable()
export class UserService {

  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>,
              @InjectModel(Schedule.name) private scheduleModel: Model<ScheduleDocument>) {}

  async createUser(dto: CreateUserDto) {
    const user = await this.userModel.findOne({email: dto.email})
    if (user)
      throw new BadRequestException(`User email ${dto.email} is already exists`)
    
    const passHash = pbkdf2Sync(dto.password, 'salto', 1000, 25, `sha512`).toString(`hex`)
    const newUser = new this.userModel({...dto, password: passHash});
    return await newUser.save()
  }

  async bookSlot(dto: BookSlotDto){
  
    const date = new Date(dto.slot.start).toISOString().slice(0, 10)
    let schedule = await this.scheduleModel.findOne({userId: dto.userId, date})
    const user = await this.userModel.findById(dto.userId)

    if (!schedule)
      schedule = new this.scheduleModel({userId: dto.userId, date, bookedSlots: []})

    if (!user)
      throw new UnprocessableEntityException('incorrect income params')

    const bookedSlots = schedule.bookedSlots
    const lunchTime = user.lunchTime

    if (this.isIntersect(dto.slot, [lunchTime, ...bookedSlots], user.workTime))
      throw new ConflictException('this time interval has already been booked')

    schedule.bookedSlots = bookedSlots.concat(dto.slot)

    await schedule.save()
    
    return schedule.bookedSlots
  }

  private isIntersect(newSlot: TimeInterval, slots: TimeInterval[], workTime: TimeInterval): boolean {
    slots.push(newSlot)
    slots.sort((a: TimeInterval, b: TimeInterval) => new Date(a.start).getTime() - new Date(b.start).getTime() )

    for (let i = 1; i < slots.length; i++)
      if (new Date(slots[i - 1].end).getTime() > new Date(slots[i].start).getTime())
        return true

    // TODO обработать workTime: не пересекается ли с новым слотом
    
    return false
  }

  async getAvailableTimeIntervals(userId: String, date: String){
    const schedule = await this.scheduleModel.findOne({userId, date})
    const user = await this.userModel.findById(userId)
    if (!schedule || !user)
      throw new UnprocessableEntityException('incorrect income id')

    const availableTimeIntervals: TimeInterval[] = []
    const bookedSlots = schedule?.bookedSlots
    const workTime = user.workTime
    const lunchTime = user.lunchTime

    // если слотов нет
    if (!bookedSlots || bookedSlots.length === 0){
      const firstPartOfDay: TimeInterval = {start: workTime.start, end: lunchTime.start}
      const secondPartOfDay: TimeInterval = {start: lunchTime.end, end: workTime.end}
      availableTimeIntervals.push(firstPartOfDay, secondPartOfDay)
    } 
    // если слоты есть 
    else {
      const availableTimes = this.calculateAvailableTimeIntervals(bookedSlots, workTime, lunchTime)
      availableTimeIntervals.push(...availableTimes)
    }

    return availableTimeIntervals
  }

  private calculateAvailableTimeIntervals(bookedSlots: TimeInterval[], workTime: TimeInterval, lunchTime: TimeInterval): TimeInterval[]{
    const availableTimes: TimeInterval[] = []
    const sortedSlots = [...bookedSlots, lunchTime].sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
    
    let currentEndTime = workTime.start

    for (const slot of sortedSlots) {
      // проверка нет ли свободного времени между currentEndTime и bookedSlotStartTime
      if (currentEndTime < slot.start) {
        const availableTimeInterval = {start: currentEndTime, end: slot.start}
        availableTimes.push(availableTimeInterval)
      }
      
      currentEndTime = slot.end < workTime.end ? slot.end : workTime.end
    }

    // проверка нет ли времени между последним слотом и концом рабочего дня
    if (currentEndTime < workTime.end) {
      const lastAvailableTimeInterval = {start: currentEndTime, end: workTime.end}
      availableTimes.push(lastAvailableTimeInterval)
    }
    return availableTimes
  }
}