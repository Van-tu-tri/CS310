package cs310.cs_310_v3.Repository;
import cs310.cs_310_v3.Model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

// REPOSITORY IS USED TO GET/ PUSH USER DATA FROM/TO MONGODB SERVER.
// REPOSITORY IS A MICROSERVICE USED FOR COMMUNICATION WITH DATABASE

public interface UserRepository extends MongoRepository<User, String>
{
    public Optional<User> findByEmail(String email);


}
