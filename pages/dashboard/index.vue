<script setup>
const items = [
  {
    id: 1,
    head: "Total Devices (Today)",
    number: "75,928",
    percent: "9.8%",
    image: "/images/devices.png",
  },
  {
    id: 2,
    head: "Active Devices",
    number: "15,743",
    percent: "5.9%",
    image: "/images/devices.png",
  },
  {
    id: 3,
    head: "Registered Areas",
    number: "463",
    percent: "5.9%",
    image: "/images/pins.png",
  },
  {
    id: 4,
    head: "Total Users",
    number: "53,923",
    percent: "5.9%",
    image: "/images/people.png",
  },
];

const items_2 = [
  {
    id: 1,
    head: "New Users (Today)",
    number: "85",
    percent: "5.9%",
    image: "/images/new-users.png",
  },
  {
    id: 2,
    head: "New Devices (Today)",
    number: "64",
    percent: "5.9%",
    image: "/images/green-devices.png",
  },
];

const item_3 = 
    {
      id: 3,
      head: 'Total Alerts (Today)',
      number: '25,743',
      percent: '5.9%',
      image: '/images/yellow-bell.png',
    }

const table_items = ref([
  {
    id: 1,
    date: "12/06/2025",
    time: "12:12",
    name: "Jo Macejkovic",
    location_name: "Bangkok 1 School",
  },
  {
    id: 2,
    date: "12/06/2025",
    time: "12:10",
    name: "Cody Kunde",
    location_name: "Bangkok 2 School",
  },
  {
    id: 3,
    date: "12/06/2025",
    time: "12:12",
    name: "Darlene Schultz",
    location_name: "Bangkok 1 School",
  },
  {
    id: 4,
    date: "12/06/2025",
    time: "12:10",
    name: "Rufus Ferry",
    location_name: "Bangkok 3 School",
  },
  {
    id: 5,
    date: "12/06/2025",
    time: "12:10",
    name: "Brenda O'Kon-Kutch",
    location_name: "Bangkok 1 School",
  },
  {
    id: 6,
    date: "12/06/2025",
    time: "12:10",
    name: "Randall Bauch",
    location_name: "Bangkok 2 School",
  },
]);

const coordinates = [
  {
    id: 1,
    name: "Bangkok 1 School",
    latitude: 13.756,
    longtitude: 100.502
  },
  {
    id: 2,
    name: "Bangkok 2 School",
    latitude: 13.756,
    longtitude: 100.502
  },
  {
    id: 3,
    name: "Bangkok 3 School",
    latitude: 18.788,
    longtitude: 98.985
  },
]

const currentPage = ref(1)
const pageSize = 10
const totalPages = computed(() => Math.ceil(105 / pageSize))

const pageNumbers = computed(() => {
    const pages = []
    const total = totalPages.value
    const current = currentPage.value

    if (total <= 5) {
        for (let i = 1; i <= total; i++) pages.push(i)
    } else {
        if (current <= 3) {
            pages.push(1, 2, 3, 4, 5, "...", total)
        } else if (current >= total - 2) {
            pages.push(1, "...", total - 4, total - 3, total - 2, total - 1, total)
        } else {
            pages.push(1, "...", current - 1, current, current + 1, "...", total)
        }
    }

    return pages
})

function goToPage(page) {
    if (page === "...") return
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page
    }
}

// Heatmap data
const heatmapData = ref([
  { day: 'Mon', hours: { '9am': 800, '10am': 1200, '11am': 1500, '12pm': 2500, '1pm': 2200, '2pm': 1800, '3pm': 900 } },
  { day: 'Tue', hours: { '9am': 900, '10am': 1100, '11am': 1600, '12pm': 2800, '1pm': 2400, '2pm': 1900, '3pm': 1000 } },
  { day: 'Wed', hours: { '9am': 850, '10am': 1300, '11am': 1400, '12pm': 2600, '1pm': 2300, '2pm': 1700, '3pm': 950 } },
  { day: 'Thu', hours: { '9am': 950, '10am': 1200, '11am': 1700, '12pm': 2700, '1pm': 2500, '2pm': 2000, '3pm': 1100 } },
  { day: 'Fri', hours: { '9am': 1000, '10am': 1400, '11am': 1800, '12pm': 2900, '1pm': 2600, '2pm': 2100, '3pm': 1200 } },
  { day: 'Sat', hours: { '9am': 600, '10am': 800, '11am': 1000, '12pm': 1500, '1pm': 1200, '2pm': 900, '3pm': 700 } },
  { day: 'Sun', hours: { '9am': 500, '10am': 700, '11am': 900, '12pm': 1300, '1pm': 1000, '2pm': 800, '3pm': 600 } }
])

const hours = ['9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm']

function getHeatmapColor(value) {
  if (value >= 3000) return '#80A4FF' // 3000+
  if (value >= 1000) return '#B9CDFF' // 1000-2000
  return '#EBF6FF' // <1000
}

const peakHour = computed(() => {
  let maxValue = 0
  let peakTime = ''
  heatmapData.value.forEach(day => {
    Object.entries(day.hours).forEach(([hour, value]) => {
      if (value > maxValue) {
        maxValue = value
        peakTime = hour
      }
    })
  })
  return { value: maxValue, time: peakTime }
})
</script>

<template>
  <div>
    <div class="title-bar">
      <a> Dashboard </a>
    </div>

    <div class="content-bar">
      <div class="search-bar">
        <div class="box">
          <select class="search-button" :style="{ width: '447px', fontSize: '14px' }">
            <option value="" disabled selected>School</option>
          </select>
          <select class="search-button" :style="{ width: '257px', fontSize: '14px' }">
            <option value="" disabled selected>Time</option>
          </select>
          <div class="button">
            <img
              :style="{ height: '16px', width: '16px' }"
              :src="'/images/export.png'"
            />
            <a> Export </a>
          </div>
        </div>
        <div class="updated-time">
          <img
            :style="{ height: '16px', width: '16px' }"
            :src="'/images/clock.png'"
          />
          <a> Updated 15s ago </a>
        </div>
      </div>
      <div class="card-bar">
        <div
          v-for="item in items"
          :key="item.id"
          class="card"
          :style="{ height: '201px', width: '266px' }"
        >
          <img :style="{ height: '32px', width: '32px' }" :src="item.image" />
          <a class="head"> {{ item.head }} </a>
          <a class="number"> {{ item.number }} </a>
          <div class="percent">
            <span :style="{ color: '#2AA937' }"> {{ item.percent }} </span> from
            last month
          </div>
        </div>
      </div>
      <div class="card-bar">
        <div
          v-for="item in items_2"
          :key="item.id"
          class="card"
          :style="{
            gap: '24px',
            height: '143px',
            width: '558px',
            flexDirection: 'row',
            alignItems: 'center',
          }"
        >
          <div>
            <img :style="{ height: '95px', width: '95px' }" :src="item.image" />
          </div>
          <div
            :style="{ display: 'flex', flexDirection: 'column', gap: '8px' }"
          >
            <a class="head"> {{ item.head }} </a>
            <a class="number"> {{ item.number }} </a>
            <div class="percent">
              <span :style="{ color: '#2AA937' }"> {{ item.percent }} </span>
              from last month
            </div>
          </div>
        </div>
      </div>

      <div class="three-cards">
        <!-- Left Column -->
        <div :style="{ display: 'flex', flexDirection: 'column' }">
          <div
          class="card"
          :style="{
            gap: '24px',
            height: '143px',
            width: '558px',
            flexDirection: 'row',
            alignItems: 'center',
          }"
        >
          <div>
            <img :style="{ height: '95px', width: '95px' }" :src="item_3.image" />
          </div>
          <div
            :style="{ display: 'flex', flexDirection: 'column', gap: '8px' }"
          >
            <a class="head"> {{ item_3.head }} </a>
            <a class="number"> {{ item_3.number }} </a>
            <div class="percent">
              <span :style="{ color: '#2AA937' }"> {{ item_3.percent }} </span>
              from last month
            </div>
          </div>
        </div>
          <div class="card" :style="{ height: '397px', width: '558px', padding: '20px', gap: '0px'  }">
            <div :style="{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '8px'}">
              <a :style="{ fontSize: '20px', fontWeight: 'bold', color: '#848484'}"> Alerts Heatmap (Week by Hour) </a>
              <select class="search-button" :style="{ width: '127px', height: '40px', fontSize: '14px'}">
                  <option value="" disabled selected> Last 7 Days </option>
              </select>
            </div>
            
            <!-- Peak hour summary -->
            <div :style="{ fontSize: '14px', color: '#848A90', paddingBottom: '6px' }">
              <strong :style="{ color: 'black'}"> {{ peakHour.value.toLocaleString() }}</strong> visitors in peak hour
            </div>
            
            <!-- Color legend -->
            <div :style="{ display: 'flex', gap: '16px', fontSize: '12px', color: '#848A90', paddingBottom: '6px' }">
              <div :style="{ display: 'flex', alignItems: 'center', gap: '4px' }">
                <div :style="{ width: '12px', height: '12px', backgroundColor: '#80A4FF', borderRadius: '25%' }"></div>
                <span>3,000+</span>
              </div>
              <div :style="{ display: 'flex', alignItems: 'center', gap: '4px' }">
                <div :style="{ width: '12px', height: '12px', backgroundColor: '#B9CDFF', borderRadius: '25%' }"></div>
                <span>1,000-2,000</span>
              </div>
              <div :style="{ display: 'flex', alignItems: 'center', gap: '4px' }">
                <div :style="{ width: '12px', height: '12px', backgroundColor: '#EBF6FF', borderRadius: '25%' }"></div>
                <span>&lt;1,000</span>
              </div>
            </div>
            
            <!-- Heatmap Grid -->
            <div :style="{ display: 'flex', flexDirection: 'column', width: '510px', height: '247px', gap: '4px' }">
              <!-- Heatmap rows -->
              <div v-for="hour in hours" :key="hour" :style="{ display: 'flex', gap: '4px', alignItems: 'center', marginBottom: '2px' }">
                <!-- Hour label (Y-axis) -->
                <div :style="{ width: '45px', fontSize: '12px', color: '#848A90', textAlign: 'right', paddingRight: '8px', fontWeight: '500' }">
                  {{ hour }}
                </div>
                
                <!-- Heatmap cells -->
                <div v-for="day in heatmapData" :key="`${day.day}-${hour}`"
                     :style="{ 
                       width: '62.14px', 
                       height: '28.57px', 
                       backgroundColor: getHeatmapColor(day.hours[hour]),
                       borderRadius: '3px',
                       cursor: 'pointer',
                       transition: 'opacity 0.2s',
                       marginRight: '0px'
                     }"
                     @mouseover="$event.target.style.opacity = '0.8'"
                     @mouseout="$event.target.style.opacity = '1'"
                     :title="`${day.day} ${hour}: ${day.hours[hour].toLocaleString()} visitors`">
                </div>
              </div>
              
              <!-- Footer row with days (X-axis) - under the heatmap -->
              <div :style="{ display: 'flex', gap: '0px', marginLeft: '50px' }">
                <div v-for="day in heatmapData" :key="day.day" 
                     :style="{ width: '65px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: '#848A90', fontWeight: '500' }">
                  {{ day.day }}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Right Column -->
        <div class="card" :style="{ height: '564px', width: '558px', gap: '0px' }">
          <a class="sc-location" :style="{paddingBottom: '24px'}"> School Locations </a>
          <img :src="'/images/map.png'" />
          <div :style="{display: 'flex', flexDirection: 'column',paddingTop: '24px'}">
          <div :style="{display: 'flex', flexDirection: 'column',gap: '4px'}">
            <a v-for="item in coordinates" :key="item.id" :style="{ display: 'flex', alignItems: 'center', gap: '0px'}"> <span> <img :src="'/images/pin.png'" :style="{width: '13.46px', height: '18.36px'}"/> </span> <span :style="{fontSize: '14px', color: '#2AA937', paddingLeft: '8px'}"> {{ item.name }}  <span :style="{color: '#848A90', paddingLeft: '8px'}"> ({{ item.latitude }}, {{ item.longtitude }}) </span> </span> </a>
          </div>
          </div>
        </div>
      </div>

       <div class="card" :style="{ height: '534px', width: '1137px' }">
         <div :style="{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}">
            <a :style="{ fontSize: '20px', fontWeight: 'bold', color: '#848484'}"> Latest Alerts </a>
            <select class="search-button" :style="{ width: '93px', height: '40px', fontSize: '14px'}">
                <option value="" disabled selected>Today</option>
            </select>
         </div>
         <div class="bg-white rounded-xl overflow-hidden" :style="{ border: '1px solid #e5e7eb' }">
           <table class="w-full text-left border-collapse">
             <thead class="bg-gray-100">
               <tr :style="{ height: '40px', color: '#848A90'}">
                 <th
                   @click="sortTable('date')"
                   :style="{paddingLeft: '12px', cursor: 'pointer' }"
                 >
                   Date {{ sortColumn === 'date' ? (sortDirection === 'asc' ? '▲' : '▼') : '' }}
                 </th>
                 <th @click="sortTable('time')" :style="{ cursor: 'pointer' }">
                   Time {{ sortColumn === 'time' ? (sortDirection === 'asc' ? '▲' : '▼') : '' }}
                 </th>
                 <th @click="sortTable('name')" :style="{ cursor: 'pointer' }">
                   Name {{ sortColumn === 'name' ? (sortDirection === 'asc' ? '▲' : '▼') : '' }}
                 </th>
                 <th
                   @click="sortTable('location_name')"
                   :style="{ cursor: 'pointer' }"
                 >
                   Location Name {{ sortColumn === 'location_name' ? (sortDirection === 'asc' ? '▲' : '▼') : '' }}
                 </th>
               </tr>
             </thead>
             <tbody>
               <tr
                 v-for="item in table_items"
                 :key="item.id"
                 :style="{ height: '56px', borderBottom: '1px solid #e5e7eb' }"
               >
                 <td :style="{ paddingLeft: '12px', color: '#848A90' }">{{ item.date }}</td>
                 <td :style="{color: '#848A90'}" >{{ item.time }}</td>
                 <td>{{ item.name }}</td>
                 <td>{{ item.location_name }}</td>
               </tr>
             </tbody>
           </table>
         </div>
         <div class="flex justify-end items-center p-4">
                <button class="text-color-main2 disabled:text-gray-600" :disabled="currentPage === 1"
                    @click="goToPage(currentPage - 1)">
                    &lt; Previous
                </button>

                <div>
                    <button v-for="page in pageNumbers" :key="page + '-btn'" class="px-3 py-1 rounded"
                        :disabled="page === '...'" :class="page === currentPage
                            ? 'bg-blue-500 text-white'
                            : page === '...'
                                ? 'bg-transparent text-gray-500 cursor-default'
                                : 'bg-white text-color-main2'
                            " @click="goToPage(page)">
                        {{ page }}
                    </button>
                </div>

                <button class="text-color-main2 disabled:text-gray-600" :disabled="currentPage === totalPages"
                    @click="goToPage(currentPage + 1)">
                    Next &gt;
                </button>
            </div>
       </div>
    </div>
  </div>
</template>

<style scoped>
* {
  font-family: "Noto Sans", sans-serif;
  gap: 24px;
}

.sc-location {
  color: #848484;
  font-size: 20px;
  font-weight: bold;
}

.updated-time {
  display: flex;
  flex-direction: row;
  font-size: 12px;
  gap: 8px;
  color: #b9b9b9;
}

.three-cards {
  display: flex;
  flex-direction: row;
}

.box {
  display: flex;
  flex-direction: row;
  gap: 16px;
}

.head {
  color: #848484;
  font-size: 16px;
  font-weight: bold;
}

.number {
  font-size: 32px;
  font-weight: bold;
}

.percent {
  color: #848a90;
  font-size: 14px;
}

.card {
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 24px;
}

.card-bar {
  display: flex;
  flex-direction: row;
  gap: 24px;
}

.content-bar {
  display: flex;
  flex-direction: column;
  gap: 24px;
  height: 100%;
  padding: 24px;
  width: 100%;
}

.search-bar {
  align-items: center;
  justify-content: space-between;
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  display: flex;
  gap: 16px;
  height: 88px;
  padding: 24px;
}

.button {
  align-items: center;
  background-color: #0198ff;
  color: #ffffff;
  font-weight: bold;
  gap: 8px;
  justify-content: center;
  border: 0px;
  display: flex;
  width: 102px;
}

.search-button {
  display: flex;
  align-items: center;
  padding: 10.5px;
}

.search-button,
.button {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  height: 40px;
}

.title-bar {
  align-items: center;
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  display: flex;
  height: 82px;
  padding: 24px;
  width: 100%;
  font-size: 36px;
  font-family: "Noto Sans", sans-serif;
  font-weight: bold;
}

.three-cards {
  display: flex;
  flex-direction: row;
}
</style>
