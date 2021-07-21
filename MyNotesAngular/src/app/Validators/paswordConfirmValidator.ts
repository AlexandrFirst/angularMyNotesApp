import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export const paswordConfirmValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    
    
    const pass = control.get('password');
    const confirmPass = control.get('confirmPassword');
    console.log("here")

    if (pass && confirmPass && pass.value === confirmPass.value) {
        console.log(pass.value)
        console.log(confirmPass.value)
        return null;
    }
    else {
        return {
            passwordConfirmation: true
        }
    }
};