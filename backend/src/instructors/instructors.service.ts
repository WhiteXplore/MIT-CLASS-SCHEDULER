import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Instructor } from './entities/instructor.entity';
import { CreateInstructorDto } from './dto/create-instructor.dto';
import { UpdateInstructorDto } from './dto/update-instructor.dto';
import { Bachelor } from 'src/bachelor/entities/bachelor.entity';
import { Master } from 'src/master/entities/master.entity';
import { Doctorate } from 'src/doctorate/entities/doctorate.entity';
import * as XLSX from 'xlsx';
import { BadRequestException } from '@nestjs/common';
import { User_Accounts } from 'src/user/entities/user.entity';
import * as bcrypt from 'bcrypt';
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
    @InjectRepository(User_Accounts)
    private readonly userRepository: Repository<User_Accounts>,
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
      const DEFAULT_PASSWORD = 'SJPIICD2026';

      for (const row of data as any[]) {
        // ==========================
        // Validate Required Fields
        // ==========================
        if (
          !row.employee_id ||
          !row.instructor_fname ||
          !row.instructor_lname
        ) {
          throw new BadRequestException(
            `Missing required fields for employee ${row.employee_id || 'Unknown'}`,
          );
        }

        // ==========================
        // Clean Data
        // ==========================
        const employee_id = row.employee_id.toString().trim();
        const instructor_fname = row.instructor_fname.toString().trim();
        const instructor_mname = row.instructor_mname
          ? row.instructor_mname.toString().trim()
          : '';
        const instructor_lname = row.instructor_lname.toString().trim();
        const instructor_gender = row.instructor_gender
          ? row.instructor_gender.toString().trim()
          : '';
        const instructor_jobtype = row.instructor_jobtype
          ? row.instructor_jobtype.toString().trim()
          : '';

        const position = row.position ? row.position.toString().trim() : '';

        const office = row.office ? row.office.toString().trim() : '';

        const email = row.email
          ? row.email.toString().trim().toLowerCase()
          : '';

        const role = row.role ? row.role.toString().trim() : 'Instructor';

        // ==========================
        // Check Instructor Duplicate
        // ==========================
        const existingInstructor = await this.instructorRepository.findOne({
          where: {
            employee_id,
          },
        });

        let savedInstructor: Instructor;

        if (existingInstructor) {
          savedInstructor = existingInstructor;
        } else {
          const instructor = this.instructorRepository.create({
            employee_id,
            instructor_fname,
            instructor_mname,
            instructor_lname,
            instructor_gender,
            instructor_jobtype,
          });

          savedInstructor = await this.instructorRepository.save(instructor);
        }

        instructors.push(savedInstructor);

        // ==========================
        // Check User Duplicate
        // ==========================
        const existingUser = await this.userRepository.findOne({
          where: {
            employee_id,
          },
        });

        if (!existingUser) {
          const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, 10);

          const user = this.userRepository.create({
            employee_id,
            first_name: instructor_fname,
            last_name: instructor_lname,
            position,
            office,
            email,
            role,
            password: hashedPassword,
          });

          await this.userRepository.save(user);
        }
      }

      return {
        message: 'Excel uploaded successfully',
        total: instructors.length,
        data: instructors,
      };
    } catch (error) {
      console.error(error);

      throw new BadRequestException(error.message || 'Failed to upload excel');
    }
  }
}
