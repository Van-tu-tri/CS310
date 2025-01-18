package cs310.cs_310_v3.Model;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

// DATA STRUCTURE FOR GROUP TO STORE THEM IN MONGODB DATABASE

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "groups")
public class Group
{
    @Id
    private String id;
    private String GroupName;
    private List<String> GroupMembers;
    private LocalDateTime creationTime;
    private List<MessageBlock> Messages;

    public Group(String GroupName, List<String> GroupMembers, String creator)
    {
        this.GroupName = GroupName;
        this.GroupMembers = GroupMembers;
        this.creationTime = LocalDateTime.now();
        this.Messages = new ArrayList<MessageBlock>();
        this.id = creator + "_" + this.GroupName;
    }

}