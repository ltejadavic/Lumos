import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Role } from './role.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  nombre: string;

  @Column()
  apellidos: string;

  @Column({ nullable: true })
  telefono: string;

  @Column({ nullable: true })
  colegio: string;

  @Column({ nullable: true })
  universidad: string;

  @Column()
  distrito: string;

  @Column()
  provincia: string;

  @Column()
  ciudad: string;

  @Column()
  pais: string;

  @ManyToOne(() => Role, (role) => role.id)
  @JoinColumn({ name: 'role_id' }) // Agrega la columna `role_id` en la tabla `users`
  role: Role;
}