package cs310.cs_310_v3.Model;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;

// DATA STRUCTURE TO STORE MESSAGES IN MONGODB DATABASE

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "messages")
public class Message
{
    @Id
    private String id;
    private String[] conversation;
    private List<MessageBlock> messages;

    public Message(String email1, String email2)
    {
        this.conversation = new String[2];
        this.conversation[0] = email1;
        this.conversation[1] = email2;
        Arrays.sort(this.conversation);
        this.id = this.conversation[0] + "_" + this.conversation[1];
        this.messages = new ArrayList<MessageBlock>();
    }

    public String getId() {return this.id;}
    public String[] getUsers () {return this.conversation;}
    public List<MessageBlock> getMessages() {return this.messages;}

    public void addMessage(MessageBlock message)
    {
        this.messages.add(message);
    }
}
