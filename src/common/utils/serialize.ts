import { instanceToPlain, plainToClass, plainToInstance } from 'class-transformer'
import { validateSync, ValidatorOptions } from 'class-validator'

type TransformationFunction<T, U> = (data: T) => U

const options = { excludeExtraneousValues: true, enableImplicitConversion: true }

/**
 * Serializes data to a class instance (usually a DTO).
 */
export function serialize<T, U>(
  data: T,
  classType: new () => U,
  transform?: TransformationFunction<T, U>,
  validationOptions?: ValidatorOptions
): U {
  const dto: U = plainToInstance(classType, instanceToPlain(transform ? transform(data) : data), options)
  const errors = validateSync(dto as object, validationOptions)
  if (errors.length > 0) console.log('errors', errors) // throw new Error('Validation error')
  return dto
}

export function serializeArray<T, U>(dataArray: T[], classType: new () => U, transformationFn?: (data: T) => U): U[] {
  return dataArray.map((item) => serialize(item, classType, transformationFn))
}
