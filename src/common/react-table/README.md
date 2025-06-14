# Generic Table Component

재사용 가능한 제네릭 테이블 컴포넌트입니다. `@tanstack/react-table`을 기반으로 하며, 타입 안전성과 높은 커스터마이징 가능성을 제공합니다.

## 특징

- 🔥 **완전한 타입 안전성**: TypeScript 제네릭 지원
- 🚀 **높은 재사용성**: 어떤 데이터 타입에도 사용 가능
- 🎛️ **유연한 설정**: 필터, 정렬, 선택 기능을 선택적으로 활성화
- 📱 **반응형 디자인**: 모바일 친화적인 UI
- 🎨 **커스터마이징 가능**: 컬럼, 필터, 디스플레이 네임 설정

## 기본 사용법

```tsx
import { GenericTable, ToggleHeader } from "./table";
import { ColumnDef } from "@tanstack/react-table";

// 1. 데이터 타입 정의
interface User {
  id: string;
  name: string;
  email: string;
  age: number;
}

// 2. 컬럼 정의
const userColumns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <ToggleHeader column={column}>Name</ToggleHeader>,
    cell: ({ row }) => <div>{row.original.name}</div>,
  },
  {
    accessorKey: "email",
    header: ({ column }) => <ToggleHeader column={column}>Email</ToggleHeader>,
    cell: ({ row }) => <div>{row.original.email}</div>,
  },
  {
    accessorKey: "age",
    header: ({ column }) => <ToggleHeader column={column}>Age</ToggleHeader>,
    cell: ({ row }) => <div>{row.original.age}</div>,
  },
];

// 3. 컴포넌트 사용
function UserTable({ users }: { users: User[] }) {
  return <GenericTable data={users} columns={userColumns} />;
}
```

## 고급 사용법

### 필터링 설정

```tsx
import { FilterConfig } from "./table";

const userFilters: FilterConfig[] = [
  {
    id: "name",
    label: "Name",
    placeholder: "Search by name...",
  },
  {
    id: "email",
    label: "Email",
    placeholder: "Search by email...",
  },
];

<GenericTable data={users} columns={userColumns} filters={userFilters} showFilters={true} />;
```

### 정렬 표시 이름 설정

```tsx
import { TableDisplayName } from "./table";

const userDisplayNames: TableDisplayName = {
  name: "Full Name",
  email: "Email Address",
  age: "Age (years)",
};

<GenericTable data={users} columns={userColumns} displayNames={userDisplayNames} showSortInfo={true} />;
```

### 선택 기능 활성화

```tsx
import { useState } from "react";
import { RowSelectionState } from "@tanstack/react-table";

function UserTableWithSelection({ users }: { users: User[] }) {
  const [selection, setSelection] = useState<RowSelectionState>({});

  return (
    <GenericTable
      data={users}
      columns={userColumns}
      selection={selection}
      onSelectionChange={setSelection}
      enableSelection={true}
      showSelectionCount={true}
    />
  );
}
```

### 행 클릭 핸들링

```tsx
<GenericTable
  data={users}
  columns={userColumns}
  onRowClick={(index) => {
    console.log("Clicked row:", users[index]);
  }}
/>
```

## Props

### SelectableTableProps<TData>

| Prop                 | Type                                                    | Default      | Description                           |
| -------------------- | ------------------------------------------------------- | ------------ | ------------------------------------- | ----------------- |
| `data`               | `TData[]`                                               | -            | **필수**. 테이블에 표시할 데이터 배열 |
| `columns`            | `ColumnDef<TData>[]`                                    | -            | **필수**. 테이블 컬럼 정의            |
| `selection`          | `Record<number, boolean>`                               | -            | 선택된 행들의 상태                    |
| `onSelectionChange`  | `OnChangeFn<RowSelectionState>`                         | -            | 선택 상태 변경 핸들러                 |
| `onRowClick`         | `(index: number) => void`                               | -            | 행 클릭 핸들러                        |
| `sorting`            | `SortingState`                                          | -            | 정렬 상태                             |
| `setSorting`         | `React.Dispatch<React.SetStateAction<SortingState>>`    | -            | 정렬 상태 설정 함수                   |
| `setRowModel`        | `React.Dispatch<React.SetStateAction<RowModel<TData> \\ | undefined>>` | -                                     | 행 모델 설정 함수 |
| `filters`            | `FilterConfig[]`                                        | `[]`         | 필터 설정 배열                        |
| `displayNames`       | `TableDisplayName`                                      | `{}`         | 컬럼 표시 이름 매핑                   |
| `showFilters`        | `boolean`                                               | `true`       | 필터 UI 표시 여부                     |
| `showSortInfo`       | `boolean`                                               | `true`       | 정렬 정보 표시 여부                   |
| `showSelectionCount` | `boolean`                                               | `true`       | 선택 카운트 표시 여부                 |
| `enableSelection`    | `boolean`                                               | `true`       | 선택 기능 활성화 여부                 |

### FilterConfig

| Prop          | Type     | Description                 |
| ------------- | -------- | --------------------------- |
| `id`          | `string` | 필터링할 컬럼의 accessorKey |
| `label`       | `string` | 필터 라벨                   |
| `placeholder` | `string` | 입력 필드 플레이스홀더      |

## 유틸리티 함수

### createSelectionColumn<TData>()

체크박스 선택 컬럼을 생성합니다.

```tsx
import { createSelectionColumn } from "./table";

const columns = [
  createSelectionColumn<User>(),
  // ... 다른 컬럼들
];
```

### ToggleHeader

정렬 가능한 헤더 컴포넌트입니다.

```tsx
{
  accessorKey: "name",
  header: ({ column }) => <ToggleHeader column={column}>Name</ToggleHeader>,
}
```

## 마이그레이션 가이드

기존 `MusicTable`에서 `GenericTable`로 마이그레이션:

### Before

```tsx
<MusicTable musics={musics} selection={selection} onSelectionChange={setSelection} />
```

### After

```tsx
<GenericTable
  data={musics}
  columns={musicColumns}
  selection={selection}
  onSelectionChange={setSelection}
  filters={musicFilters}
  displayNames={musicDisplayNames}
/>
```

`music-table-example.tsx` 파일을 참고하여 기존 Music 테이블을 새로운 제네릭 테이블로 마이그레이션할 수 있습니다.
