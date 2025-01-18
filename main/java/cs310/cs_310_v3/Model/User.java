package cs310.cs_310_v3.Model;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.ArrayList;
import java.util.List;

// DATA STRUCTURE TO KEEP USERS DATA INSIDE MONGODB DATABASE

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "users")
public class User
{
    @Id
    private String email;
    private String name;
    private String lastname;
    private String password;

    private List<String> friendRequestsSend; // List of usernames who sent friend requests
    private List<String> friendRequestsReceive;
    private List<String> friends; // List of usernames who are friends
    private List<String> groups;

    public User(String email,String password, String name, String lastname)
    {
        this.email = email;
        this.name = name;
        this.lastname = lastname;
        this.password = password;
        this.friendRequestsSend = new ArrayList<String>();
        this.friendRequestsReceive = new ArrayList<String>();
        this.friends = new ArrayList<String>();
        this.groups = new ArrayList<String>();
    }

    public String getEmail() {return this.email;}
    public void setEmail(String email) {this.email = email;}

    public String getName() {return this.name;}
    public void setName(String name) {this.name = name;}

    public String getLastname() {return this.lastname;}
    public void setLastname(String lastname) {this.lastname = lastname;}

    public String getPassword() {return this.password;}
    public void setPassword(String password) {this.password = password;}

    public List<String> getFriendRequestsSend() { return this.friendRequestsSend;}
    public List<String> getFriendRequestsReceive() { return this.friendRequestsReceive;}
    public List<String> getFriends() {return this.friends;}
    public List<String> getGroups() {return this.groups;}

}
