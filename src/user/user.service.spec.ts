import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getModelToken } from 'nestjs-typegoose';

describe('UserService', () => {
  let service: UserService;

  const exec = { exec: jest.fn() };
  const userRepositoryFactory = () => ({
    find: () => exec,
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          useFactory: userRepositoryFactory,
          provide: getModelToken('UserModel'),
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('getAll', async () => {
    const expectedResult = [{ name: 'Антон', tgId: '123456789' }];
    userRepositoryFactory().find().exec.mockReturnValueOnce(expectedResult);

    const result = await service.getAll();
    expect(result).toEqual(expectedResult);
  });
});
