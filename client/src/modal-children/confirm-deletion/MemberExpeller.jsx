import { correctRoute } from "../../helpers";
import DeletionWarning from "./DeletionWarning";

export default function MemberExpeller({memberToExpel, onDelete, onClose}) {

    // console.log(memberToExpel);

    function handleExpel() {
        fetch(correctRoute(`/memberships/${memberToExpel.id}`), {
            method: "DELETE"
        })
        .then((response) => {
            if (response.ok) {
                onDelete(memberToExpel);
                alert(`You removed \'${memberToExpel.user.username}\'.`);
            } else {
                throw new Error("An internal error occurred. Please contact support.");
            }
        })
        .catch((error) => {
            console.error(error);
            alert(error);
        })
        .finally(() => onClose());
    }

    return (
        <DeletionWarning
            buttonText={<p>Yes, expel <b>{memberToExpel.user.username}</b> from this organization!</p>}
            preventDefault={true}
            onDelete={handleExpel}
            onClose={onClose}
        >
            <p>To proceed, click the yellow button below. Note that the user
                will be notified by email of his/her expulsion.
            </p>
        </DeletionWarning>
    )
}