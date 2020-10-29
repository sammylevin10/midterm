import csv
mapping = {}

file = open("/Users/sammylevin/dynamic-web/midterm/src/data/county-fips.csv", "r")

for line in file:
    line = line.split(",")
    mapping[line[1]] = line[0]
# mapping the county to zip codes

mask_file = open(
    "/Users/sammylevin/dynamic-web/midterm/src/data/us-counties.csv", "r")

new_file = open("coviddata.csv", "w")
writer = csv.writer(new_file)
elements = []
# elements is list of lists, each list contained in list is a line to the CSV
first = True
# this is for checking we are not on the first line


for mask_line in mask_file:
    sub_ele = []
    mask_line = mask_line.split(",")
    if first:
        first = False
        sub_ele.append("Zip Code")
        sub_ele += mask_line[4:]
        elements.append(sub_ele)
    else:
        try:
            zip_code = mapping[mask_line[3]]
            sub_ele.append(zip_code)
            sub_ele += mask_line[4:]
            elements.append(sub_ele)
        except:
            print("Error, county code #", mask_line[0])


for shit in elements:
    writer.writerow(shit)
