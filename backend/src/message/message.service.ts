import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './message.entity';
import { User } from '../user/user.entity';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private repo: Repository<Message>,
  ) {}

  findAll() {
    return this.repo.find();
  }

  findOne(id: number) {
    return this.repo.findOne({ where: { id } });
  }

  create(data: Partial<Message>) {
    const message = this.repo.create({
      ...data,
      timestamp: new Date(),
    });
    return this.repo.save(message);
  }

  update(id: number, data: Partial<Message>) {
    return this.repo.update(id, data);
  }

  remove(id: number) {
    return this.repo.delete(id);
  }

  async getMessagesBetween(senderId: number, receiverId: number): Promise<Message[]> {
    return this.repo.find({
      where: [
        { sender: { id: senderId }, receiver: { id: receiverId } },
        { sender: { id: receiverId }, receiver: { id: senderId } },
      ],
      relations: ['sender', 'receiver'],
      order: { timestamp: 'ASC' },
    });
  }

  async getConversationUsers(userId: number): Promise<User[]> {
    const sent = await this.repo.find({
      where: { sender: { id: userId } },
      relations: ['receiver'],
    });

    const received = await this.repo.find({
      where: { receiver: { id: userId } },
      relations: ['sender'],
    });

    const users = [
      ...sent.map(m => m.receiver),
      ...received.map(m => m.sender),
    ];

    return users.filter(
      (user, index, self) => index === self.findIndex(u => u.id === user.id)
    );
  }
}
