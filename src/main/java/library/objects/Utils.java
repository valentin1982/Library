package library.objects;


import library.enums.SearchType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import javax.faces.context.FacesContext;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
@Scope("singleton")
public class Utils implements Serializable {

    private Map<String, SearchType> searchTypeList = new HashMap<String, SearchType>();

    private String searchString;

    private List<String> images;

    @Autowired
    private MessageSource msg;

    public Map<String, SearchType> getSearchTypeList() {
        searchTypeList.clear();
        searchTypeList.put(msg.getMessage("author_name", null, FacesContext.getCurrentInstance().getViewRoot().getLocale()), SearchType.AUTHOR);
        searchTypeList.put(msg.getMessage("book_name", null, FacesContext.getCurrentInstance().getViewRoot().getLocale()), SearchType.TITLE);
        return searchTypeList;
    }

    @PostConstruct
    public void init() {
        images = new ArrayList<String>();
        for (int i = 1; i <= 14; i++) {
            images.add("book" + i + ".jpg");
        }
    }

    public List<String> getImages() {
        return images;
    }

    public void setSearchTypeList(Map<String, SearchType> searchTypeList) {
        this.searchTypeList = searchTypeList;
    }

    public String getSearchString() {
        return searchString;
    }

    public void setSearchString(String searchString) {
        this.searchString = searchString;
    }
}
