package cs310.cs_310_v3.Repository;
import cs310.cs_310_v3.Model.Group;
import cs310.cs_310_v3.Model.Message;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

// REPOSITORY IS USED TO GET/ PUSH GROUP DATA FROM/TO MONGODB SERVER.
// REPOSITORY IS A MICROSERVICE USED FOR COMMUNICATION WITH DATABASE

public interface GroupRepository extends MongoRepository<Group, String> {
    public Optional<Group> findById(String id);
}
