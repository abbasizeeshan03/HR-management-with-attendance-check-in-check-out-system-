export class CreateUserDto {
  name: string;
  email: string;
  role?: string; // Optional: will default to 'employee' if left blank
}