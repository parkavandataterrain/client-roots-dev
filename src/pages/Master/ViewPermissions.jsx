import React, { useEffect, useMemo, useState } from "react";
import axios from "../../helper/axiosInstance";
import Switch from "@mui/material/Switch";

import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

export default function PermissionsView({
  permissionsState = [],
  setPermissionsState = () => {},
}) {
  //   const [permissionsState, setPermissionsState] = useState([]);
  const [permissionsData, setPermissionsData] = useState([]);
  const [loading, setLoading] = useState(true);
  //   const [permissionsData, setPermissionsData] = useState([
  //     {
  //       id: 1,
  //       category_name: "System",
  //       subcategory_name: null,
  //       permissions: [
  //         {
  //           id: 145,
  //           name: "Can add user",
  //           codename: "add_customuser",
  //         },
  //         {
  //           id: 146,
  //           name: "Can change user",
  //           codename: "change_customuser",
  //         },
  //         {
  //           id: 147,
  //           name: "Can delete user",
  //           codename: "delete_customuser",
  //         },
  //         {
  //           id: 148,
  //           name: "Can view user",
  //           codename: "view_customuser",
  //         },
  //       ],
  //     },
  //     {
  //       id: 2,
  //       category_name: "Assignment & Referrals",
  //       subcategory_name: null,
  //       permissions: [],
  //     },
  //     {
  //       id: 3,
  //       category_name: "Client Documentation",
  //       subcategory_name: "Forms",
  //       permissions: [],
  //     },
  //     {
  //       id: 4,
  //       category_name: "Client Documentation",
  //       subcategory_name: "Care Plans",
  //       permissions: [],
  //     },
  //     {
  //       id: 5,
  //       category_name: "Client Documentation",
  //       subcategory_name: "Priority Lists",
  //       permissions: [],
  //     },
  //     {
  //       id: 6,
  //       category_name: "Client Documentation",
  //       subcategory_name: "Client Chart",
  //       permissions: [],
  //     },
  //     {
  //       id: 7,
  //       category_name: "Client Documentation",
  //       subcategory_name: "Encounter Notes",
  //       permissions: [],
  //     },
  //     {
  //       id: 8,
  //       category_name: "Client Documentation",
  //       subcategory_name: "Calendar",
  //       permissions: [],
  //     },
  //     {
  //       id: 9,
  //       category_name: "Data Management",
  //       subcategory_name: null,
  //       permissions: [],
  //     },
  //   ]);

  const [value, setValue] = useState("");
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const togglePermission = (permission) => {
    const isActive = permissionsState.find((itm) => itm.id === permission.id);

    if (isActive) {
      setPermissionsState((prev) => {
        return prev.filter((itm) => itm.id !== permission.id);
      });
    } else {
      setPermissionsState((prev) => {
        return [...prev, permission];
      });
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/permission-category");
      setPermissionsData(data);
      if (data.length > 0) {
        setValue(data[0].id + ":" + data[0].category_name);
      }
    } catch (error) {
      // Handle errors here
      console.error("Error fetching permission category :", error);
    } finally {
      setLoading(false);
    }
  };

  const tabsLabel = useMemo(() => {
    return permissionsData.map((itm) => {
      console.log({ itm });

      let displayLabel = itm.category_name;

      if (itm.subcategory_name) {
        displayLabel = itm.subcategory_name;
      }
      return {
        id: itm.id,
        category_name: itm.category_name,
        label: itm.id + ":" + displayLabel,
      };
    });
  }, [permissionsData]);

  const groupByResourceGroup = (data) => {
    if (data && data.length > 0) {
      return data.reduce((acc, item) => {
        const { resource_group } = item;
        if (!acc[resource_group]) {
          acc[resource_group] = [];
        }
        acc[resource_group].push(item);
        return acc;
      }, {});
    }
    return [];
  };

  const tabsComponent = useMemo(() => {
    if (value === "") {
      return [];
    } else {
      let idOfCat = value.split(":")[0];
      let filteredPermissionData = permissionsData.filter(
        (pd) => +pd.id === +idOfCat
      );

      if (filteredPermissionData.length > 0) {
        if (
          filteredPermissionData[0]?.permissions &&
          filteredPermissionData[0]?.permissions.length > 0
        ) {
          let newFilteredPermissionData = { ...filteredPermissionData[0] };
          newFilteredPermissionData.permissions = groupByResourceGroup(
            newFilteredPermissionData.permissions
          );
          filteredPermissionData[0] = newFilteredPermissionData;
          return filteredPermissionData;
        }
      }
      return filteredPermissionData;
    }
  }, [permissionsData, value]);

  const dependencyDisable = (cat_id, permissionList, permission) => {
    if (permission.name.toLocaleLowerCase().includes("view")) {
      return false;
    } else {
      let foundViewPermission = permissionList.find((itm) => {
        return itm.name.toLocaleLowerCase().includes("view");
      });

      if (foundViewPermission) {
        const isActive = permissionsState.find(
          (itm) => itm.id === foundViewPermission.id
        );
        return isActive ? false : true;
      }
    }
  };

  const renderPermissionsByResourceGroup = (cat_id, groupedData) => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {Object.keys(groupedData).map((resourceGroup, idx) => {
          return (
            <div
              key={resourceGroup}
              // className={`${
              //   idx % 2 === 0 && "border-r-[1px]"
              // } border-b-[1px] border-gray-200 break-inside-avoid-column p-4`}

              className={`border-[1px] border-gray-200 break-inside-avoid-column p-4`}
            >
              {/* #REVIEW HARD CODED  */}
              {cat_id === 19 && <h2>{resourceGroup}</h2>}
              <ul className="mt-4">
                {groupedData[resourceGroup].map((permission) => {
                  const isActive = permissionsState.find(
                    (itm) => itm.id === permission.id
                  );

                  let disableSwitch = false;

                  if (cat_id === 19) {
                    disableSwitch = dependencyDisable(
                      cat_id,
                      groupedData[resourceGroup],
                      permission
                    );

                    if (disableSwitch) {
                      isActive && togglePermission(permission);
                    }
                  }

                  return (
                    <li
                      key={permission.id}
                      className="my-2 flex items-center gap-2"
                    >
                      <Switch
                        size="small"
                        checked={isActive === undefined ? false : true}
                        onChange={(e) => togglePermission(permission)}
                        sx={{
                          "& .MuiSwitch-switchBase.Mui-checked": {
                            color: isActive
                              ? "rgb(45, 212, 191)"
                              : "rgb(173, 173, 173)",
                            "&:hover": {
                              backgroundColor: "rgba(45, 212, 191, 0.08)",
                            },
                          },
                          "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                            {
                              backgroundColor: isActive
                                ? "rgb(45, 212, 191)"
                                : "rgb(173, 173, 173)",
                            },
                          "& .MuiSwitch-thumb": {
                            backgroundColor: disableSwitch
                              ? "rgb(223 223 223)"
                              : isActive
                              ? "rgb(45, 212, 191)"
                              : "rgb(173, 173, 173)",
                            boxShadow: "none",
                          },
                          "& .MuiSwitch-track": {
                            backgroundColor: isActive
                              ? "rgba(45, 212, 191, 0.5)"
                              : "rgb(173, 173, 173, 0.8)", // for unchecked state
                          },
                        }}
                        disabled={disableSwitch}
                      />
                      <span className="text-xs">{permission.name}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    );
  };
  return (
    <div>
      <p className="text-base mb-2.5">Permissions</p>
      <div className="flex flex-column gap-4">
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="wrapped label tabs example"
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            ".MuiTab-root": {
              backgroundColor: "#fff",
              color: "#000",
              "&.Mui-selected": {
                backgroundColor: "#5BC4BF",
                color: "#ffffff",
                borderBottom: "2px solid #5BC4BF",
                zIndex: 1,
              },
            },
            ".MuiTabs-indicator": {
              backgroundColor: "#5BC4BF",
              height: "100% !important",
            },
          }}
        >
          {tabsLabel.map((t) => (
            <Tab value={t.label} label={t.label.split(":")[1]} wrapped />
          ))}
        </Tabs>

        {loading ? (
          <p className="mt-1 animate-pulse text-xs w-100 text-center">
            Loading...
          </p>
        ) : (
          <div className="container p-2">
            <div className="flex w-100 gap-4">
              {tabsComponent.length === 0 && (
                <p className="text-xs my-3">No Permission Category Exist</p>
              )}
              {tabsComponent.map((category) => {
                console.log({ category });

                return (
                  <div
                    key={category.id}
                    className="border border-teal-500 p-4 rounded-lg w-100"
                  >
                    {/* <h2 className="text-base font-bold text-teal-700">
                      {category.category_name}
                    </h2> */}

                    <div className="hidden flex items-center justify-between">
                      <h2 className="text-base font-bold text-teal-700">All</h2>
                      <Switch
                        size="small"
                        // checked={isActive}
                        // onChange={(e) => togglePermission(permission)}
                      />
                    </div>
                    {/* {category.subcategory_name && (
                      <h3 className="text-xs text-teal-600">
                        {category.subcategory_name}
                      </h3>
                    )} */}
                    {Object.keys(category.permissions).length > 0 ? (
                      renderPermissionsByResourceGroup(
                        category.id,
                        category.permissions
                      )
                    ) : (
                      <p className="text-xs text-gray-500 my-3 mt-4">
                        No permissions available.
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
