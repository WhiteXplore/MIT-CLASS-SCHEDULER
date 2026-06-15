import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Instructor } from './entities/instructor.entity';
import { CreateInstructorDto } from './dto/create-instructor.dto';
import { UpdateInstructorDto } from './dto/update-instructor.dto';
import { Bachelor } from 'src/bachelor/entities/bachelor.entity';
import { Master } from 'src/master/entities/master.entity';
import { Doctorate } from 'src/doctorate/entities/doctorate.entity';import * as XLSX from 'xlsx';
import { BadRequestException } from '@nestjs/common';
@Injectable()
export class InstructorsService {
  constructor(
    @InjectRepository(Instructor)
    private readonly instructorRepository: Repository<Instructor>,
    @InjectRepository(Bachelor)
    private readonly bachelorRepository: Repository<Bachelor>,
    @InjectRepository(Master)
    private readonly masterRepository: Repository<Master>,
    @InjectRepository(Doctorate)
    private readonly doctorRepository: Repository<Doctorate>,
  ) {}
  async create(createInstructorDto: CreateInstructorDto): Promise<Instructor> {
    const {
      bachelorprogram_id,
      masterprogram_id,
      doctorateprogram_id,
      ...rest
    } = createInstructorDto;

    let bachelor: Bachelor | null = null;
    let master: Master | null = null;
    let doctorate: Doctorate | null = null;

    if (bachelorprogram_id) {
      bachelor = await this.bachelorRepository.findOne({
        where: { bachelorprogram_id },
      });
      if (!bachelor) {
        throw new NotFoundException(
          `Bachelor program ID ${bachelorprogram_id} not found`,
        );
      }
    }

    if (masterprogram_id) {
      master = await this.masterRepository.findOne({
        where: { masterprogram_id },
      });
      if (!master) {
        throw new NotFoundException(
          `Master program ID ${masterprogram_id} not found`,
        );
      }
    }

    if (doctorateprogram_id) {
      doctorate = await this.doctorRepository.findOne({
        where: { doctorateprogram_id },
      });
      if (!doctorate) {
        throw new NotFoundException(
          `Doctor program ID ${doctorateprogram_id} not found`,
        );
      }
    }

    const instructor = this.instructorRepository.create({
      ...rest,
      bachelor: bachelor ?? undefined,
      master: master ?? undefined,
      doctorate: doctorate ?? undefined,
    });

    return this.instructorRepository.save(instructor);
  }

  async findAll(): Promise<Instructor[]> {
    return this.instructorRepository.find({
      relations: ['bachelor', 'master', 'doctorate'],
    });
  }

  async findOne(id: number): Promise<Instructor> {
    const instructor = await this.instructorRepository.findOne({
      where: { instructor_id: id },
      relations: ['bachelor', 'master', 'doctorate'],
    });
    if (!instructor) {
      throw new NotFoundException(`Instructor with ID ${id} not found`);
    }
    return instructor;
  }

  async update(
    id: number,
    updateInstructorDto: UpdateInstructorDto,
  ): Promise<Instructor> {
    const {
      bachelorprogram_id,
      masterprogram_id,
      doctorateprogram_id,
      ...rest
    } = updateInstructorDto;

    let bachelor: Bachelor | null = null;
    let master: Master | null = null;
    let doctorate: Doctorate | null = null;

    if (bachelorprogram_id && bachelorprogram_id !== 0) {
      bachelor = await this.bachelorRepository.findOne({
        where: { bachelorprogram_id },
      });
      if (!bachelor) {
        throw new NotFoundException(
          `Bachelor program ID ${bachelorprogram_id} not found`,
        );
      }
    }

    if (masterprogram_id && masterprogram_id !== 0) {
      master = await this.masterRepository.findOne({
        where: { masterprogram_id },
      });
      if (!master) {
        throw new NotFoundException(
          `Master program ID ${masterprogram_id} not found`,
        );
      }
    }

    if (doctorateprogram_id && doctorateprogram_id !== 0) {
      doctorate = await this.doctorRepository.findOne({
        where: { doctorateprogram_id },
      });
      if (!doctorate) {
        throw new NotFoundException(
          `Doctor program ID ${doctorateprogram_id} not found`,
        );
      }
    }

    const instructor = await this.instructorRepository.preload({
      instructor_id: id,
      ...rest,
      bachelor: bachelor ?? undefined,
      master: master ?? undefined,
      doctorate: doctorate ?? undefined,
    });

    if (!instructor) {
      throw new NotFoundException(`Instructor with ID ${id} not found`);
    }

    return this.instructorRepository.save(instructor);
  }

  async remove(id: number): Promise<void> {
    const result = await this.instructorRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Instructor with ID ${id} not found`);
    }
  }


  async uploadExcel(file: Express.Multer.File) {
  try {
    const workbook = XLSX.read(file.buffer, {
      type: 'buffer',
    });

    const sheetName = workbook.SheetNames[0];

    const worksheet = workbook.Sheets[sheetName];

    const data = XLSX.utils.sheet_to_json(worksheet);

    if (!data.length) {
      throw new BadRequestException('Excel file is empty');
    }

    const instructors: Instructor[] = [];

    for (const row of data as any[]) {
      const instructor = this.instructorRepository.create({
        instructor_fname: row.instructor_fname || '',
        instructor_mname: row.instructor_mname || '',
        instructor_lname: row.instructor_lname || '',
        instructor_gender: row.instructor_gender || '',
        instructor_jobtype: row.instructor_jobtype || '',
        employee_id: row.employee_id || '',
      });

      const savedInstructor =
        await this.instructorRepository.save(instructor);

      instructors.push(savedInstructor);
    }

    return {
      message: 'Excel uploaded successfully',
      total: instructors.length,
      data: instructors,
    };
  } catch (error) {
    console.error(error);

    throw new BadRequestException(
      error.message || 'Failed to upload excel',
    );
  }
}
}
