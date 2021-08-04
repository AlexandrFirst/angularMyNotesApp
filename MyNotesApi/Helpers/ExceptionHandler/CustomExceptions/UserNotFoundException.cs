using System;

namespace MyNotesApi.Helpers.ExceptionHandler.CustomExceptions
{
    public class UserNotFoundException:Exception
    {
        public UserNotFoundException():base("Can't find the user! Try again later"){}
    }
}