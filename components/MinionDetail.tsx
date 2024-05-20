import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AXIOS_CLIENT from "../utils/axios";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Job } from "../types";
import { ALL_EVENTS, EVENTS_WITH_ANY_FILTER } from "../utils/Urls";
import Chip from "@mui/material/Chip";
import { Cancel, CheckCircle, Search } from "@mui/icons-material";
import DataGridOverlay from "./DataGridOverlay";
import Input from "@mui/material/Input";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";

export default function MinionDetail() {
  const { node, minionName } = useParams();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [columns, setColumns] = useState<GridColDef<(typeof rows)[number]>[]>(
    []
  );
  const [rows, setRows] = useState<Array<object>>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRows, setFilteredRows] = useState<Array<object>>([]);

  const sortedColumnList = [
    "jid",
    "id",
    "fun",
    "fun_args",
    "return",
    "retcode",
    "success",
    "_stamp",
  ];

  useEffect(() => {
    const getJobs = async () => {
      try {
        let URL = "";
        if (minionName === "All Minions") {
          URL = ALL_EVENTS;
        } else {
          URL = EVENTS_WITH_ANY_FILTER.replace("<node_type>", node!).replace(
            "<value>",
            minionName!
          );
        }
        const res = await AXIOS_CLIENT.get(URL);
        const keys = Object.keys(res.data);
        console.log(keys);

        const jobsTemp: Job[] = [];
        keys.map((key) => jobsTemp.push(res.data[key]));
        setJobs(jobsTemp);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };
    getJobs();
  }, [minionName]);

  useEffect(() => {
    let columKeys = Object.keys(jobs[0] ?? {});
    let columnDef: GridColDef<(typeof rows)[number]>[] = [];

    sortedColumnList.map((col) => {
      columKeys.map((column: string) => {
        if (col === column) {
          columnDef.push({
            field: column === "id" ? "minion" : column,
            headerName:
              column === "id"
                ? "MINION"
                : column === "fun"
                ? "FUNCTION"
                : column === "fun_args"
                ? "COMMAND"
                : column === "_stamp"
                ? "TIMESTAMP"
                : column === "retcode"
                ? "RETURN CODE"
                : column.toUpperCase(),
            type: column === "retcode" ? "number" : "string",
            width: 210,
            flex: 1,
            headerClassName: "data_grid_header",
            renderCell: (params) => {
              if (column === "success") {
                return (
                  <Chip
                    variant="outlined"
                    icon={params.value ? <CheckCircle /> : <Cancel />}
                    label={params.value ? "True" : "False"}
                    color={params.value ? "success" : "error"}
                  />
                );
              }
            },
          });
        }
      });
    });

    setColumns(columnDef);

    const rowsData: Array<object> = [];

    jobs.map((job, index) => {
      console.log(job);

      rowsData.push({
        id: index,
        jid: job.jid,
        minion: job.id,
        fun: job.fun,
        fun_args: job.fun_args,
        return: job.return,
        retcode: job.retcode,
        success: job.success,
        _stamp: new Intl.DateTimeFormat("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }).format(new Date(job._stamp)),
      });
    });

    setRows(rowsData);
    setFilteredRows(rowsData);
  }, [jobs]);

  useEffect(() => {
    const filteredData = rows.filter(
      (
        row //to filter the row based on the searched word
      ) =>
        Object.values(row).some(
          (
            value //to check if the value searched is in any of the row or not
          ) =>
            value.toString().toLowerCase().includes(searchQuery.toLowerCase()) //to make teh search case insensitive
        )
    );
    setFilteredRows(filteredData);
  }, [searchQuery, rows]);

  return (
    <div>
      <div className="page-header">
        <Box sx={{ "& > :not(style)": { m: 1 } }}>
          <FormControl variant="standard">
            <Input
              type="text"
              sx={{ minWidth: "700px", textDecoration: "none" }}
              placeholder="Search here ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-bar"
              id="input-with-icon-adornment"
              startAdornment={
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              }
              disableUnderline
            />
          </FormControl>
        </Box>
      </div>
      <div className="minion_detail_container">
        <Box
          className="data_grid_container"
          sx={{
            "& .MuiDataGrid-root": {
              minHeight: "600px",
            },
            minHeight: "600px",
          }}
        >
          <DataGrid
            slots={{
              noRowsOverlay: DataGridOverlay,
            }}
            autoHeight
            rows={filteredRows.map((row) => ({
              ...row,
              "data-tooltip": Object.values(row).join(" "),
            }))}
            // rows={rows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 20,
                },
              },
            }}
            pageSizeOptions={[5, 10, 25, 50]}
            disableRowSelectionOnClick
            getRowClassName={(params) =>
              (params.row as Job).success
                ? "data_grid_row_success"
                : "data_grid_row_failure"
            }
          />
        </Box>
      </div>
    </div>
  );
}
