package cs310.cs_310_v3.Model;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// USED IN CONTROLLER TO SEND MESSAGES TO A SINGLE USER
@Data
@AllArgsConstructor
@NoArgsConstructor
public class MessageSent
{
    private String receiver;
    private String message;


    public String getReceiver(){return receiver;}
    public String getMessage(){return message;}
}
