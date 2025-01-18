package cs310.cs_310_v3.Model;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// USED IN CONTROLLER PARAMETER TO LOG-IN

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginRequest
{
    private String email;
    private String password;


    public String getEmail() {return email;}
    public String getPassword() {return password;}
}
