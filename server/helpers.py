import inspect
import sys
import types
from sqlalchemy.exc import IntegrityError

def is_non_empty_string(var):
    """Validates whether a given variable is a non-empty string.

    Args:
        var (any): the variable to validate.

    Returns:
        bool: True if the variable is an instance of str; False otherwise.
    """
    return isinstance(var, str) and len(var)

class RoleType:
    """
        Static class that holds constants for membership roles.

    Raises:
        TypeError: if anyone tries to instantiate this class.
    """
    
    REGULAR = "REGULAR"
    ADMIN = "ADMIN"
    OWNER = "OWNER"
    
    def __init__(self):
        raise TypeError("The \'RoleType\' class cannot be instantiated")
    
    @classmethod
    def is_valid_role_name(cls, role_name):
        """Returns whether a given argumnet is one of the three role names defined in this class.

        Args:
            role_name (str): the role name to validate.

        Returns:
            bool: True if role_name is REGULAR, ADMIN, or OWNER; False otherwise.
        """
        return role_name == cls.REGULAR or role_name == cls.ADMIN or role_name == cls.OWNER
    
    @classmethod
    def get_all(cls):
        """Returns all the possible role types.

        Returns:
            tuple: All the role types as a tuple.
        """
        return (cls.REGULAR, cls.ADMIN, cls.OWNER)


INVOKED_STACK_INDEX = 2
"""
The index of the stack array that corresponds to the function that another function was invoked on.
"""

MODEL_INVOKER_INDEX = 7
"""
The index of the stack array that corresponds to the function that another function was invoked on, when being invoked from a db.Model.
"""

INVOKED_METHOD_NAME_INDEX = 3
"""
The index of the stack array that corresponds to the name of the function.
"""


def get_invoked_method_name():
    """Gets the name of the function/method that another function/method was invoked on.

    Returns:
        str: the name of the funciton/method.
    """
    return inspect.stack()[INVOKED_STACK_INDEX][INVOKED_METHOD_NAME_INDEX]


def stack_trace():
    for method in inspect.stack():
        print(method[INVOKED_METHOD_NAME_INDEX])

# For debugging
def get_model_invoker():
    return inspect.stack()[MODEL_INVOKER_INDEX][INVOKED_METHOD_NAME_INDEX]


def print_starting_seed(model_name):
    """Notifies on terminal that seeding of a model is starting, but does NOT break the current line.

    Args:
        model_name (str): the model name to print.
    """
    print(f"Seeding {model_name}: ", end="", flush=True)
    
def println_starting_seed(model_name):
    """Notifies on terminal that seeding of a model is starting, and then breaks the current line.

    Args:
        model_name (str): the model name to print.
    """
    print(f"Seeding {model_name}: ")
    
def print_ending_seed(model_name):
    """Notifies on terminal that seeding of a model has been complete.

    Args:
        model_name (str): the model name to print.
    """
    print(f"{model_name.title()} seeding complete.")


def print_progress(condition, progress_mark="."):
    """Prints a progress mark during seeding.

    Args:
        condition (bool): if true, then progress will continue to print on the same line; otherwise, line breaks after each print statement.
        progress_mark (str, optional): the mark to print. Defaults to ".".
    """
    print(progress_mark, end="" if condition else "\n", flush=True)

# Specifically for python seed.py - All callback functions must return something.
def execute_to_success(callback, progress_condition, limit=sys.maxsize, *args):
    """
    Executes a callback function as many times as possible until it returns without any errors.
    This function is meant to be used only in seed.py. Do not use anywhere else.

    Args:
        callback (function): the function to execute.
        progress_condition (bool): the condition for the progress_printing functions to evaluate.
        limit (int, optional): the maximum number of times to execute the callback function. Defaults to sys.maxsize.

    Raises:
        Exception: If execution failed after the attempt limit has reached.
        ValueError: _description_

    Returns:
        _any_: the return object of the callback function.
    """
    if isinstance(callback, types.FunctionType) and type(limit) is int:
        execution_successful = False
        counter = 0
        return_object = None
        
        while (not execution_successful) and counter < limit:
            try:
                return_object = callback(*args)
                execution_successful = True
                print_progress(progress_condition)
            except (ValueError, IntegrityError) as e:
                print(e)
                print(f"Attempt {counter + 1} out of {limit} failed.")
            finally:
                counter += 1
                if (not execution_successful and counter < limit):
                    print("Trying again!")
        if not execution_successful:
            raise Exception("Execution not successful.")
        return return_object
    else:
        raise ValueError(
            "Callback and limit must be of types function and int respectively."
        )