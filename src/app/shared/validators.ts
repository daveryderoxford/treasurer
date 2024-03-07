
import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

const currencyReg = /^[0-9]{1,3}(?:,?[0-9]{3})*(?:\.[0-9]{2})?$/;
const bankACReg = '^[0-9]{8}$';
const sortCodeReg = '^[0-9]{2}-[0-9]{2}-[0-9]{2}$';

export const currencyValidator  = Validators.pattern(currencyReg);
export const sortCodeValidator = Validators.pattern(sortCodeReg);
export const bankACValidator = Validators.pattern(bankACReg);
