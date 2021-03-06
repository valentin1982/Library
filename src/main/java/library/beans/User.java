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

    private String username;
    private String password;

    /**
     * User constructor
     */
    public User() {
    }

    /**
     * getPassword
     * @return password
     */
    public final String getPassword() {
        return password;
    }

    /**
     * set password
     * @param
     */
    public final void setPassword(final String password) {
        this.password = password;
    }

    /**
     * get Username
     * @return username
     */
    public final String getUsername() {
        logger.trace(format2.format(date));
        logger.debug(format2.format(date));
        return username;
    }

    /**
     * set Username
     * @param
     */
    public final void setUsername(final String username) {
        this.username = username;
    }
}
