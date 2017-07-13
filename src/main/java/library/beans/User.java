package library.beans;

import org.apache.log4j.Logger;
import javax.faces.bean.ManagedBean;
import javax.faces.bean.SessionScoped;
import java.io.Serializable;
import java.text.SimpleDateFormat;
import java.util.Date;

@ManagedBean
@SessionScoped
public class User implements Serializable {

    private static Logger logger = Logger.getLogger(User.class);

    private Date date = new Date();

    private SimpleDateFormat format2 = new SimpleDateFormat("dd MM yyyy hh:mm");

    String username;
    String password;

    public User() {
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getUsername() {
        logger.trace(format2.format(date));
        logger.debug(format2.format(date));
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}
