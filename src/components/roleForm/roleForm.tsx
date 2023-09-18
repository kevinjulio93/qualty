import "./roleForm.scss";
import {
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Switch,
  TextField,
} from "@mui/material";
import {
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
  Fragment,
} from "react";
import { arrayPermissions, arraySections } from "../../constants/resources";

const RoleForm = forwardRef((props: any, ref) => {
  const [role, setRole] = useState("");
  const [permissions, setPermissions] = useState([]);
  const [forceRender, setForceRender] = useState(+new Date());

  useImperativeHandle(ref, () => {
    return {
      getRole,
    };
  });

  const getRole = () => {
    return { role, permissions };
  };

  useEffect(() => {
    setCurrentRole();
  }, []);

  const setCurrentRole = () => {
    if (props.currentRole) {
      setRole(props.currentRole.role);
      setPermissions(props.currentRole.permissions);
    }
  };

  const formHanlder = (e: any) => {
    const value = e.target.value;
    setRole(value);
  };

  const permissionHandler = (section: any, permission: any, e) => {
    const value = e.target.value;
    const index = permissions.findIndex(
      (perm: any) => perm.section === section
    );
    const tempPerm: any = permissions;
    if (index === -1) {
      const newPerm = {
        section: section,
        actions: [permission],
      };
      tempPerm.push(newPerm);
    } else {
      if (tempPerm[index].actions.includes(value))
        tempPerm[index].actions = tempPerm[index].actions.filter(
          (act) => act !== permission
        );
      else tempPerm[index].actions.push(permission);
    }
    setPermissions(tempPerm);
    const newDate = +new Date();
    setForceRender(newDate);
  };

  const validateCheck = (section: string, permission: string) => {
    return permissions.some(
      (item: any) =>
        item.section === section && item.actions.includes(permission)
    );
  };

  return (
    <>
      <form className="role-form-container" action="">
        <TextField
          className="login-view__login-form__form-container__input"
          id="role"
          name="role"
          placeholder="Role"
          type="text"
          label="Nombre del rol"
          onChange={(e) => formHanlder(e)}
          value={role || ""}
          key="role-input"
        />
        <FormControl component="fieldset" key="permissions-section">
          {arraySections.map((section, index) => {
            return (
              <Fragment key={index}>
                <FormLabel component="legend" key={section.key + "-section"}>
                  {section.value}
                </FormLabel>
                <FormGroup
                  aria-label="position"
                  key={section.key + "-legend"}
                  row
                >
                  {arrayPermissions.map((permission, index) => {
                    return (
                      <FormControlLabel
                        value={permission.key}
                        checked={validateCheck(section.key, permission.key)}
                        control={<Switch color="primary" />}
                        label={permission.value}
                        labelPlacement="start"
                        key={section.key + "-" + permission.key}
                        onChange={(e) =>
                          permissionHandler(section.key, permission.key, e)
                        }
                      />
                    );
                  })}
                </FormGroup>
              </Fragment>
            );
          })}
        </FormControl>
      </form>
    </>
  );
});

export default RoleForm;
