import { ValidationArguments } from "class-validator";

export const minLengthErrorMessage = (length: number) =>{
    return  {message : `Must be at least' ${length} characters long`};
}

export const maxLengthErrorMessage = (length: number) =>{
    return {message : `Must be at most ${length} characters long`};
}

export const RequiredFieldErrorMessage = (args: ValidationArguments) => {
    return {message : `The ${args.targetName} field cannot be empty`};
  }