package cs310.cs_310_v3.Model;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// USED FOR PARAMETER IN CONTROLLER
// FRIEND REQUEST NEEDS TWO FIELD: EMAIL (WHO SEND THE REQUEST) AND ACCEPT OR REJECT.

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FriendRequest {

    private String email;
    private String accept_or_reject;

    public FriendRequest(String email)
    {
        this.email = email;
        this.accept_or_reject = null;
    }

    public String getEmail() {return email;}
    public String getAccept_or_reject() {return accept_or_reject;}
}