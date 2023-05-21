1. **Access MySQL Command Line Client**: Open your terminal or command prompt and type `mysql -u root -p`, then press Enter.

2. **Select the Database**: To select your database, you'll use the `USE` command:
```sql
   CREATE DATABASE cs353db; //If does not exists
   USE cs353db;
```

3. **Run the Script**: Now you can run your `create_table.sql` script. You'll use the `source` command followed by the path to your script:
```sql
   source /path/to/your/create_table.sql;
```
   Make sure to replace `/path/to/your/create_table.sql` with the actual path to your `create_table.sql` file. Also, ensure the script contains valid SQL commands.

Now your database should be initialized as defined in your `create_table.sql` script.

4. **Modify Config File**: Modify the  `config.py` file according to your mysql settings. 
