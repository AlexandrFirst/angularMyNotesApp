using System;

namespace MyNotesApi.Helpers.ExceptionHandler.CustomExceptions
{
    public class UserExistsException : Exception
    {
        public UserExistsException(string existingMail)
            : base("The user with email " + existingMail + " exists")
        {

        }
    }
}