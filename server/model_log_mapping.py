from helpers import RoleType

def do_nothing(arg1 = None, arg2 = None):
    pass

class ModelLogMap:
    """_summary_"""

    mappings = {}

    def __init__(self, model_key, post=do_nothing, patch=do_nothing, delete=do_nothing):
        """_summary_

        Args:
            model_key (_type_): _description_
            post (_type_, optional): _description_. Defaults to do_nothing.
            patch (_type_, optional): _description_. Defaults to do_nothing.
            delete (_type_, optional): _description_. Defaults to do_nothing.
        """
        
        self.post = post
        self.patch = patch
        self.delete = delete

        type(self).mappings[model_key] = self
        
    def __repr__(self):
        return f"<ModelLogMap post={self.post}, patch={self.patch}, delete={self.delete}>"


# Membership Mapping


def membership_post(membership, admin = None):
    if membership['role'] == RoleType.OWNER:
        return [
            f"User, \"{membership['user']['username']}\", created a new organization: \"{membership['organization']['name']}\"."
        ]
    else:
        return [f"User,\"{membership['user']['username']}', joined this organization."]


def membership_patch(membership, admin):
    if membership['role'] == RoleType.REGULAR:
        return [
            f"User,\"{membership['user']['username']}\" has been demoted to {RoleType.REGULAR} by admin, \"{admin.username}\"."
        ]
    else:
        return [
            f"User,\"{membership['user']['username']}\" has been promoted to {membership['role']} by admin, \"{admin.username}\"."
        ]


def membership_delete(membership, expeller):
    if expeller.id == membership['user_id']:
        return [f"User,\"{membership['user']['username']}\" left this organization."]
    else:
        return [
            f"Admin,\"{expeller.username}', removed user,\"{membership['user']['username']}', from this organization"
        ]

membership_map = ModelLogMap(
    "membership_l", membership_post, membership_patch, membership_delete
)

# Item Mapping

def item_post(item_response, arg2 = None):
    return [
        "An item has been assigned by the seed to this organization",
        f"Name: {item_response['item']['name']}",
        f"Part #: {item_response['item'].get('part_number')}"
    ]
    
item_map = ModelLogMap(
    model_key = "item_l",
    post = item_post
)

# Assignment Mapping

def assignment_post(assignment_response, user):
    return [
        f"An item has been assigned by user, \"{user.username}\", to this organization",
        f"Name: {assignment_response['assignment']['item']['name']}",
        f"Part #: {assignment_response['assignment']['item']['part_number']}"
    ]

def assignment_patch(arg1 = None, arg = None):
    # Will require advanced processing at a later date.
    return [
        "Item assignment updated."
    ]
    
def assignment_delete(assignment, admin):
    return [
        f"An item has been unassigned by admin, \"{admin.username}\", from this organization",
        f"Name: {assignment['item']['name']}",
        f"Part #: {assignment['item']['part_number']}"
    ]

assignment_map = ModelLogMap(
    "assignment_l",
    assignment_post,
    assignment_patch,
    assignment_delete
)

# Organization Mapping

def org_patch(arg1 = None, arg2 = None):
    return [
        "The owner has updated the name/description/logo/banner of this organization"
    ]
    
org_map = ModelLogMap(
    model_key = "organization_l",
    patch = org_patch
)

